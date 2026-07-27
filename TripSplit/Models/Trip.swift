import Foundation
import SwiftData

@Model
final class Trip {
    var id: UUID
    var name: String
    var destination: String
    var startDate: Date
    var endDate: Date
    var currencyCode: String
    var createdAt: Date

    @Relationship(deleteRule: .cascade, inverse: \Participant.trip)
    var participants: [Participant]

    @Relationship(deleteRule: .cascade, inverse: \Expense.trip)
    var expenses: [Expense]

    init(
        id: UUID = UUID(),
        name: String,
        destination: String,
        startDate: Date,
        endDate: Date,
        currencyCode: String = "EUR",
        createdAt: Date = Date(),
        participants: [Participant] = [],
        expenses: [Expense] = []
    ) {
        self.id = id
        self.name = name
        self.destination = destination
        self.startDate = startDate
        self.endDate = endDate
        self.currencyCode = currencyCode
        self.createdAt = createdAt
        self.participants = participants
        self.expenses = expenses
    }

    var totalSpent: Double {
        expenses.reduce(0) { total, expense in
            total + expense.amount
        }
    }
}
