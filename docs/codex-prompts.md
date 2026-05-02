# Codex Prompts

## A. Bootstrap project prompt

```text
$project-bootstrap

Проверь, готов ли проект Mini Beauty CRM к разработке.

Нужно:
- Next.js App Router;
- TypeScript;
- Tailwind;
- shadcn/ui;
- Supabase setup;
- env example;
- scripts;
- docs;
- no secrets.

Не добавляй зависимости без подтверждения.
Дай план следующих шагов.
```

## B. New CRM feature prompt

```text
$feature-implementation

Задача:
[описание фичи]

Контекст:
Это Mini Beauty CRM для салонов красоты в Санкт-Петербурге.
Стек: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase, RLS.
Не перепроектируй архитектуру.
Сначала найди существующий flow и переиспользуй текущие patterns.

Сделай:
1. Изучи релевантные файлы.
2. Опиши текущий flow.
3. Дай короткий план.
4. Реализуй minimal diff.
5. Добавь/обнови тесты.
6. Запусти релевантные проверки.
7. Если есть UI — выполни browser verification.
8. Проверь CRM business rules.
9. Проверь Supabase/RLS/privacy/security.
10. Проверь regression risks.
11. Дай финальный отчёт.
```

## C. Supabase/RLS prompt

```text
$supabase-rls-review
$data-model-review

Задача:
[описание изменения базы/RLS]

Проверь:
- RLS enabled;
- salon_id isolation;
- policies for select/insert/update/delete;
- auth.uid usage;
- indexes;
- constraints;
- migrations;
- no private server key in client;
- manual SQL checks/tests.
```

## D. Appointment/calendar feature prompt

```text
$crm-appointment-feature
$browser-qa

Задача:
[описание фичи записи/календаря]

Проверь:
- service duration;
- price snapshot;
- end_time calculation;
- master availability;
- salon working hours;
- appointment conflict prevention;
- status transitions;
- Europe/Moscow;
- day/week/list UI;
- tests;
- browser verification.
```

## E. Client feature prompt

```text
$crm-client-feature
$privacy-security-check

Задача:
[описание фичи клиента]

Проверь:
- validation;
- phone normalization;
- duplicate phone warning;
- visit history;
- notes privacy;
- unauthorized access;
- RLS;
- UI states;
- tests.
```

## F. Service/master feature prompt

```text
$crm-service-master-feature
$browser-qa

Задача:
[описание фичи услуг/мастеров]

Проверь:
- price validation;
- duration validation;
- active/inactive behavior;
- categories;
- master specialization;
- appointment dependencies;
- UI states;
- tests.
```

## G. UI feature prompt

```text
$ui-feature
$browser-qa

Задача:
[описание UI-фичи]

Проверь:
- loading;
- error;
- empty;
- success;
- disabled;
- mobile;
- tablet;
- long names/text;
- Russian text;
- ₽ prices;
- date/time;
- console errors;
- network errors.

Если доступен Figma MCP, сравни с дизайном.
```

## H. Full-stack CRM feature prompt

```text
$feature-implementation
$api-integration
$ui-feature
$browser-qa

Задача:
[описание full-stack фичи]

Backend/Supabase:
- tables/actions/validation/RLS/tests.

Frontend:
- UI components/forms/state/browser verification.

Business:
- client/service/master/appointment rules.

Security:
- no client data leaks;
- no sensitive logs;
- RLS checked;
- authorization checked;
- unsafe errors avoided.
```

## I. Bugfix prompt

```text
$regression-test

Баг:
[...]

Ожидаемое поведение:
[...]

Фактическое поведение:
[...]

Сделай:
root cause → regression test → minimal fix → checks → regression review.
```

## J. Security/privacy hardening prompt

```text
$privacy-security-check
$supabase-rls-review

Проверь и улучши безопасность области:
[auth/sessions/clients/appointments/exports/uploads/roles/RLS/etc.]

Сначала сделай threat model.
Потом найди code paths.
Потом предложи minimal fixes.
Потом реализуй только безопасный scope.
Добавь тесты или manual checks.
Запусти проверки.
Дай security/privacy report.
```

## K. Pre-merge prompt

```text
$pre-merge-review

Проведи pre-merge review текущей ветки.

Spawn subagents:
- feature_reviewer;
- crm_business_reviewer;
- supabase_rls_reviewer, если есть Supabase/database/RLS changes;
- regression_hunter;
- security_privacy_reviewer;
- data_model_reviewer, если есть schema/migration changes;
- test_runner;
- ui_debugger, если есть frontend changes.

Дай verdict:
- merge readiness: yes/no;
- blocking issues;
- non-blocking issues;
- checks run;
- browser verification;
- business-rule result;
- RLS/security/privacy result;
- next step.
```

## L. Feature backlog planning prompt

```text
$feature-backlog-planner

Осмотри текущий проект и предложи следующие 10 маленьких фич для Mini Beauty CRM.

Не меняй код.

Для каждой фичи укажи:
- user value;
- target role;
- priority;
- complexity;
- risk;
- touched areas;
- tests needed;
- browser verification;
- business rules;
- RLS/security/privacy concerns;
- suggested skill;
- done criteria.
```
