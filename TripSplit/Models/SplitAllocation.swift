import Foundation
import SwiftData

@Model
final class SplitAllocation {
    var id: UUID
    var amount: Double
    var expense: Expense?
    var participant: Participant?

    init(
        id: UUID = UUID(),
        amount: Double,
        expense: Expense? = nil,
        participant: Participant? = nil
    ) {
        self.id = id
        self.amount = amount
        self.expense = expense
        self.participant = participant
    }
}
