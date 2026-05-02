# Pages and Components

## Pages

| Page | Purpose | Primary user | Data needed | Main components | States | Browser verification |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Public salon entry with product context and booking links. | Client | salon profile, featured services/masters later | PublicHeader, HeroSection, BookingCTA, TrustBlock, ContactBlock | loading not needed at static stage, error/empty when dynamic | opens, CTAs work, mobile layout |
| `/services` | Public service catalog for salon clients. | Client | active services, categories | PublicHeader, ServiceCategoryGrid, FeaturedServices, BookingCTA | loading, error, empty, success | categories, ₽, duration, CTA to booking, mobile |
| `/masters` | Public master list for salon clients. | Client | active masters | PublicHeader, FeaturedMasters, BookingCTA | loading, error, empty, success | long names/specializations, CTA, mobile |
| `/booking` | Online booking flow. | Client | services, masters, availability, salon settings | BookingFlow, BookingStepIndicator, booking steps | loading, error, empty slots, validation, success | service/master/time/client info/confirmation/conflict |
| `/contacts` | Public contacts and working hours. | Client | salon profile, phone, address, hours | PublicHeader, ContactBlock, PublicFooter | loading, error, empty, success | phone/address/hours, mobile |
| `/login` | Sign in existing users. | Owner/Admin/Master | auth session | login form | loading, error, disabled submit | valid/invalid login, redirect, mobile |
| `/register` | Create owner account. | Owner | auth session | register form | loading, error, disabled submit | validation, success redirect, mobile |
| `/dashboard` | Daily CRM overview. | Owner/Admin | today appointments, counts, revenue, popular services | StatCard, TodayAppointments, UpcomingAppointments, charts | loading, error, empty, success | cards/charts render, no console errors |
| `/clients` | Search and manage clients. | Admin/Owner | clients list | ClientsTable, ClientSearch, ClientForm | loading, error, empty, success | create/edit/search/delete, mobile |
| `/clients/[id]` | Client profile and history. | Admin/Owner/Master | client, appointments | ClientCard, ClientVisitHistory | loading, error, not found, empty history | direct refresh, unauthorized case |
| `/dashboard/services` | Manage service catalog in CRM. | Owner/Admin | services | ServicesTable, ServiceForm, badges | loading, error, empty, success | price/duration validation, long names |
| `/dashboard/masters` | Manage masters in CRM. | Owner/Admin | masters | MastersTable, MasterForm, status badge | loading, error, empty, success | active filter, contact fields, mobile |
| `/appointments` | Book and manage appointments. | Admin/Owner/Master | clients, services, masters, appointments | AppointmentsTable, AppointmentForm, filters, status menu | loading, error, empty, conflict, success | create/conflict/status/reschedule/cancel |
| `/analytics` | Business analytics. | Owner | completed appointments, revenue aggregates | RevenueChart, PopularServicesChart, MastersStats, ClientsStats | loading, error, empty, success | chart render, date filter, mobile |
| `/settings` | Salon/profile settings. | Owner | salon, profile, working hours | settings forms | loading, error, success, disabled | update fields, validation, mobile |

## Layout components

Components:
- AppSidebar
- Header
- MobileNav
- PageHeader
- EmptyState
- ConfirmDialog
- SearchInput

Responsibilities: app shell, navigation, repeated page headings, safe confirmations and search input patterns.

Props to consider: current route, user profile, salon name, nav items, title, description, action slots, empty state copy, confirm callbacks.

Validation: required labels for controls, confirm destructive actions, avoid submitting empty search unless intended.

Test ideas: active nav state, mobile nav open/close, confirm/cancel behavior, search debounce if implemented.

UI edge cases: long salon name, long Russian labels, narrow mobile width, keyboard focus, disabled actions.

## Public layout/components

Components:
- PublicHeader
- PublicFooter
- HeroSection
- ServiceCategoryGrid
- FeaturedServices
- FeaturedMasters
- BookingCTA
- TrustBlock
- ContactBlock

Responsibilities: public salon navigation, compact landing sections, service/master previews, trust cues and contact handoff.

Props to consider: salon name, nav links, CTA hrefs, featured services, featured masters, address, phone, working hours.

Validation: public data should include only active/published services and masters; phone and address should be safe to display.

Test ideas: homepage loads, CTA links work, empty featured services, long Russian text, mobile header.

UI edge cases: long salon name, no featured masters, long service categories, phone wrapping, narrow mobile viewport.

## Booking components

Components:
- BookingFlow
- BookingStepIndicator
- ServiceStep
- ServiceDetailsStep
- MasterStep
- TimeSlotStep
- ClientInfoStep
- BookingConfirmation

Responsibilities: guide client from service selection to scheduled appointment without exposing CRM complexity.

Props to consider: current step, selected service, selected master, available slots, client name/phone, validation errors, submitting state.

Validation: service required, active master or "любой подходящий", available slot required, name required, phone normalized toward `+7`.

Test ideas: complete booking, missing service, empty slots, slot conflict, invalid phone, confirmation summary.

UI edge cases: no services, no masters, no slots, long service names, mobile stepper, slow submit, conflict after final submit.

## Dashboard components

Components:
- StatCard
- UpcomingAppointments
- TodayAppointments
- PopularServicesChart
- MonthlyRevenueCard

Responsibilities: summarize operational data and link to detailed flows.

Props to consider: counts, money totals, trend labels, appointment rows, chart data, loading flags.

Validation: analytics should count only allowed statuses, usually completed for revenue.

Test ideas: empty analytics, zero revenue, completed vs cancelled totals.

UI edge cases: no appointments today, long service names, compact mobile cards, chart with sparse data.

## Clients components

Components:
- ClientsTable
- ClientForm
- ClientCard
- ClientVisitHistory
- ClientSearch
- DeleteClientDialog

Responsibilities: client CRUD, search, profile display, safe deletion and visit history.

Props to consider: client id, full name, phone, email, birthday, notes, created_at, appointment history.

Validation: full name required, phone normalized, email optional but valid, birthday optional, notes length limited.

Test ideas: duplicate phone warning, search by phone/name, unauthorized client id, notes privacy.

UI edge cases: long names, missing phone/email, large notes, empty history, mobile table overflow.

## Services components

Components:
- ServicesTable
- ServiceForm
- ServiceStatusBadge
- ServiceCategoryBadge

Responsibilities: service catalog and selectable active services.

Props to consider: title, description, price, duration_minutes, category, is_active.

Validation: title required, price >= 0, duration > 0, category from allowed list or safe custom value.

Test ideas: invalid price/duration, inactive service not selectable for new appointment, price formatting.

UI edge cases: long service title, high price, long description, empty category, mobile table.

## Masters components

Components:
- MastersTable
- MasterForm
- MasterStatusBadge

Responsibilities: staff list and active master selection.

Props to consider: full name, specialization, phone, email, is_active.

Validation: full name required, phone/email optional but valid when present.

Test ideas: inactive master filtering, unauthorized access, contact validation.

UI edge cases: long specialization, missing contact info, mobile layout.

## Appointments components

Components:
- AppointmentsTable
- AppointmentForm
- AppointmentStatusBadge
- AppointmentsFilters
- AppointmentDateGroup
- ChangeAppointmentStatusMenu

Responsibilities: booking, listing, filtering and status changes.

Props to consider: client, service, master, date, start_time, end_time, status, price, comment.

Validation: client/service/master required, start before end, active service/master, no conflict, price snapshot.

Test ideas: overlap detection, cancelled appointments do not block, duration calculates end_time, status transitions.

UI edge cases: conflict errors, long names, dense day schedule, mobile date filters, slow network.

## Analytics components

Components:
- RevenueChart
- PopularServicesChart
- MastersStats
- ClientsStats
- AnalyticsDateFilter

Responsibilities: visualize completed work and business trends.

Props to consider: date range, revenue series, service totals, master totals, new/repeat client counts.

Validation: only salon-scoped data, only completed appointments for revenue unless explicitly labeled otherwise.

Test ideas: empty range, cancelled/no-show exclusion, timezone date boundaries.

UI edge cases: no data, long labels, mobile chart width, ₽ formatting.
