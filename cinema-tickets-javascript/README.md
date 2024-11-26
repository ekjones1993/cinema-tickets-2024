# Cinema Ticket Booking System

## Business Rules Addressed

My solution follows these key business rules:

- **Ticket Types**:

  - **Infant**: £0 (no seat allocated, sits on an adult's lap).
  - **Child**: £15 (must be bought with at least one adult ticket).
  - **Adult**: £25

- **Purchase Logic**:

  - Users can buy multiple tickets in a single transaction.
  - Maximum of 25 tickets can be bought.
  - If Child or Infant tickets are requested, there must be an Adult ticket included.

- **Payment and Reservation**:

  - Utilises the existing `TicketPaymentService` to process payments.
  - Uses the `SeatReservationService` to reserve seats for Adult and Child tickets only.

- **Validation**: In my solution, the system validates account IDs and ticket requests, throwing exceptions for any invalid inputs. By incorporating "fail fast" principles, my solution will quickly identify and address issues early in the user journey, preventing further problems.

## Dynamic Design

I have developed my solution to be adaptable, making it easy for new ticket types to be encorporated in the future, such as student tickets.

- **Flexible Ticket Configuration**: Ticket types and prices are managed through a configuration object (TICKET_CONFIG), allowing for quick adjustments without the need for major code changes.

- **Dynamic Ticket Quantity Handling**: The ticket sorting logic can easily adapt to new ticket types, ensuring the system remains maintainable.

## Code Quality

I have tried to make sure the code I have written is clean and readable by using:

- **ESLint and Prettier**: Which I have configured to use the DWP ESLint package alongside Prettier for consistent code style and quality. This is to ensures that code remains readable and adheres to best practices.

## Logging

Logging is handled by the Winston library, which helps track the user journey through the system:

- **Session IDs**: Each log entry includes a session ID to maintain privacy and improve traceability.
- **Error Logging**: The system logs any errors or invalid purchase attempts, which helps to monitor and debug any issues.

## Run Instructions

```bash
nvm install
nvm use
npm install
npm test
```

## Debugging
I have been made aware that during npm install it is sometimes erroring. If you get a "npm ERR! notarget No matching version found for cross-spawn@^7.0.5." error when trying to install, please run the following before running the above commands:
```bash
npm cache clean --force
npm install
```
