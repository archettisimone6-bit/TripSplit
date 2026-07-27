import Foundation

struct BalanceEntry: Identifiable, Equatable {
    let id: UUID
    let participantID: UUID
    let name: String
    let amount: Double
}

struct Settlement: Identifiable, Equatable {
    let id = UUID()
    let fromParticipant: String
    let toParticipant: String
    let amount: Double
}

enum BalanceCalculator {
    static func balances(for trip: Trip) -> [BalanceEntry] {
        let paid = trip.expenses.reduce(into: [UUID: Double]()) { totals, expense in
            guard let payerID = expense.paidBy?.id else { return }
            totals[payerID, default: 0] += expense.amount
        }

        let owed = trip.expenses.flatMap(\.splits).reduce(into: [UUID: Double]()) { totals, split in
            guard let participantID = split.participant?.id else { return }
            totals[participantID, default: 0] += split.amount
        }

        return trip.participants
            .map { participant in
                BalanceEntry(
                    id: participant.id,
                    participantID: participant.id,
                    name: participant.name,
                    amount: rounded((paid[participant.id] ?? 0) - (owed[participant.id] ?? 0))
                )
            }
            .sorted { $0.amount > $1.amount }
    }

    static func settlements(from balances: [BalanceEntry]) -> [Settlement] {
        var creditors = balances.filter { $0.amount > 0.009 }.map { ($0.name, $0.amount) }
        var debtors = balances.filter { $0.amount < -0.009 }.map { ($0.name, -$0.amount) }
        var result: [Settlement] = []
        var creditorIndex = 0
        var debtorIndex = 0

        while creditorIndex < creditors.count, debtorIndex < debtors.count {
            let amount = rounded(min(creditors[creditorIndex].1, debtors[debtorIndex].1))
            result.append(
                Settlement(
                    fromParticipant: debtors[debtorIndex].0,
                    toParticipant: creditors[creditorIndex].0,
                    amount: amount
                )
            )

            creditors[creditorIndex].1 = rounded(creditors[creditorIndex].1 - amount)
            debtors[debtorIndex].1 = rounded(debtors[debtorIndex].1 - amount)

            if creditors[creditorIndex].1 < 0.01 { creditorIndex += 1 }
            if debtors[debtorIndex].1 < 0.01 { debtorIndex += 1 }
        }

        return result
    }

    private static func rounded(_ value: Double) -> Double {
        (value * 100).rounded() / 100
    }
}
