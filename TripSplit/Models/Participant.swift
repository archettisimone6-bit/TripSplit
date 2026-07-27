import Foundation
import SwiftData

@Model
final class Participant {
    var id: UUID
    var name: String
    var initials: String
    var colorHex: String
    var trip: Trip?

    @Relationship(deleteRule: .nullify, inverse: \Expense.paidBy)
    var paidExpenses: [Expense]

    @Relationship(deleteRule: .cascade, inverse: \SplitAllocation.participant)
    var allocations: [SplitAllocation]

    init(
        id: UUID = UUID(),
        name: String,
        colorHex: String = "4C9F92",
        trip: Trip? = nil
    ) {
        self.id = id
        self.name = name
        self.initials = name
            .split(separator: " ")
            .prefix(2)
            .compactMap(\.first)
            .map(String.init)
            .joined()
            .uppercased()

        self.colorHex = colorHex
        self.trip = trip
        self.paidExpenses = []
        self.allocations = []
    }
}
