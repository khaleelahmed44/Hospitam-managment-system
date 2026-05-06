# MediCare HMS Security Specification

## Data Invariants
1. A patient can only see their own profile and appointments.
2. A doctor can see their own profile and any appointments assigned to them.
3. Patients can only book appointments for themselves (patientId == auth.uid).
4. Appointments must have a valid doctorId and patientId.
5. Once an appointment is marked 'confirmed' or 'cancelled', only an admin can change certain fields (terminal state locking).
6. Profiles are established on first login and certain roles (admin) cannot be self-assigned.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to create a profile with `role: 'admin'`.
2. **Orphaned Write**: Create an appointment for a non-existent doctor.
3. **Ghost Field**: Add `verified: true` to an appointment update.
4. **ID Poisoning**: Use a 2KB string as a `doctorId`.
5. **PII Leak**: Authenticated user attempts to `get` another user's profile.
6. **Cross-User Update**: User A attempts to cancel User B's appointment.
7. **Timeline Bypass**: Setting an appointment in the past (client-side validation, but rules check for server timestamp on creation).
8. **Resource Exhaustion**: Sending 100 tags in an appointment's notes (if we had tags).
9. **Role Escalation**: Patient updates their own role to `doctor`.
10. **State Skipping**: Updating a 'pending' appointment directly to 'cancelled' without being the owner or a doctor.
11. **Double Booking**: (Harder to enforce only in rules, but we can enforce atomicity if we use a specific flag).
12. **System Field Injection**: Attempt to write `updatedAt` as a fixed client string instead of `request.time`.

## Test Plan
- Verify `profiles/{uid}` is readable only by the user or admin.
- Verify `appointments` list query is filtered by `patientId` or `doctorId`.
- Verify `doctors` collection is publicly readable (list/get) but only writable by admins.
- Verify `departments` collection is publicly readable but only writable by admins.
