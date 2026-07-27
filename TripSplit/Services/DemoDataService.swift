import Foundation
import SwiftData

@MainActor
enum DemoDataService {
    static func seedIfNeeded(in context: ModelContext) throws {
        var descriptor = FetchDescriptor<Trip>()
        descriptor.fetchLimit = 1
        guard try context.fetch(descriptor).isEmpty else { return }

        let calendar = Calendar.current
        let startDate = calendar.date(byAdding: .day, value: -2, to: .now) ?? .now
        let endDate = calendar.date(byAdding: .day, value: 3, to: .now) ?? .now
        let trip = Trip(
            name: "Paris Weekend",
            destination: "Paris, France",
            startDate: startDate,
            endDate: endDate
        )

        let simone = Participant(name: "Simone", colorHex: "FF6B5E", trip: trip)
        let maya = Participant(name: "Maya", colorHex: "4C9F92", trip: trip)
        let leo = Participant(name: "Leo", colorHex: "F1BE4B", trip: trip)
        trip.participants = [simone, maya, leo]

        addExpense(title: "Dinner in Le Marais", amount: 126, category: "fork.knife", payer: simone, trip: trip)
        addExpense(title: "Museum tickets", amount: 54, category: "building.columns", payer: maya, trip: trip)
        addExpense(title: "Airport train", amount: 39, category: "tram.fill", payer: leo, trip: trip)

        context.insert(trip)
        try context.save()
    }

    private static func addExpense(
        title: String,
        amount: Double,
        category: String,
        payer: Participant,
        trip: Trip
    ) {
        let expense = Expense(
            title: title,
            amount: amount,
            category: category,
            trip: trip,
            paidBy: payer
        )
        let splitAmount = amount / Double(trip.participants.count)
        expense.splits = trip.participants.map {
            SplitAllocation(amount: splitAmount, expense: expense, participant: $0)
        }
        trip.expenses.append(expense)
    }
}
