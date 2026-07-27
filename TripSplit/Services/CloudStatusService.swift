import CloudKit
import Combine

@MainActor
final class CloudStatusService: ObservableObject {
    enum Status: Equatable {
        case checking
        case available
        case unavailable
    }

    @Published private(set) var status: Status = .checking

    func refresh() async {
        do {
            let accountStatus = try await CKContainer.default().accountStatus()
            status = accountStatus == .available ? .available : .unavailable
        } catch {
            status = .unavailable
        }
    }
}
