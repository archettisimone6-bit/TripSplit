import Foundation
import SwiftData

@Model
final class Expense {
    var id: UUID
    var title: String
    var amount: Double
    var date: Date
    var category: String
    var receiptText: String?
    var createdAt: Date
    var trip: Trip?
    var paidBy: Participant?

    @Relationship(deleteRule: .cascade, inverse: \SplitAllocation.expense)
    var splits: [SplitAllocation]

    init(
        id: UUID = UUID(),
        title: String,
        amount: Double,
        date: Date = Date(),
        category: String = "ellipsis.circle.fill",
        receiptText: String? = nil,
        trip: Trip? = nil,
        paidBy: Participant? = nil,
        splits: [SplitAllocation] = [],
        createdAt: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.amount = amount
        self.date = date
        self.category = category
        self.receiptText = receiptText
        self.createdAt = createdAt
        self.trip = trip
        self.paidBy = paidBy
        self.splits = splits
    }
}
