import UIKit
@preconcurrency import Vision

struct ReceiptResult {
    let merchant: String?
    let total: Double?
    let rawText: String
}

enum ReceiptOCRService {

    static func recognize(image: UIImage) async throws -> ReceiptResult {
        guard let cgImage = image.cgImage else {
            return ReceiptResult(
                merchant: nil,
                total: nil,
                rawText: ""
            )
        }

        let lines: [String] = try await withCheckedThrowingContinuation { continuation in

            let request = VNRecognizeTextRequest { request, error in

                if let error {
                    continuation.resume(throwing: error)
                    return
                }

                let recognized = (request.results as? [VNRecognizedTextObservation])?
                    .compactMap {
                        $0.topCandidates(1).first?.string
                    } ?? []

                continuation.resume(returning: recognized)
            }

            request.recognitionLevel = .accurate
            request.usesLanguageCorrection = true

            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    let handler = VNImageRequestHandler(
                        cgImage: cgImage,
                        options: [:]
                    )

                    try handler.perform([request])

                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }

        let amount = extractLikelyTotal(from: lines)

        let merchant = lines.first { line in
            line.rangeOfCharacter(from: .letters) != nil &&
            line.count > 2
        }

        return ReceiptResult(
            merchant: merchant,
            total: amount,
            rawText: lines.joined(separator: "\n")
        )
    }

    private static func extractLikelyTotal(
        from lines: [String]
    ) -> Double? {

        let prioritized = lines.filter { line in
            let lowered = line.lowercased()

            return lowered.contains("total") ||
                   lowered.contains("amount") ||
                   lowered.contains("eur") ||
                   lowered.contains("€")
        }

        return (prioritized + Array(lines.reversed()))
            .compactMap(extractAmount)
            .first
    }

    private static func extractAmount(
        from line: String
    ) -> Double? {

        let pattern = #"(?:€|EUR\s*)?([0-9]{1,5}(?:[\.,][0-9]{2}))"#

        guard let regex = try? NSRegularExpression(
            pattern: pattern
        ),
        let match = regex.matches(
            in: line,
            range: NSRange(
                line.startIndex...,
                in: line
            )
        ).last,
        let range = Range(
            match.range(at: 1),
            in: line
        ) else {
            return nil
        }

        return Double(
            line[range]
                .replacingOccurrences(
                    of: ",",
                    with: "."
                )
        )
    }
}
