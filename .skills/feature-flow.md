name: feature-implementation-flow
on_project_start:
  steps:
    - confirm_business_model_with_user
    - define_bounded_context
  code_steps:
    - create_skeleton_use_case: "application/<UseCase>.ts com Input/Output"
    - write_node_test: "test seguindo given/when/then"
    - implement_domain: "domain/<Entity>.ts + errors"
    - create_schema: "shared/infra/db/schema/<entity>.ts"
    - create_client: "shared/infra/db/client.ts"
    - implement_repository_interface: "repository/<Repo>.ts"
    - implement_database_repository: "repository/Database<Repo>.ts recebendo tx"
    - implement_controller_router: "controller/<Module>Controller.ts chamando use case"
    - wire_transaction_in_controller: "controller usa db.transaction, passa tx para repo"
    - remove_dead_code: "limpar UoW/fakes se descartados"
    - verify_tests_and_build: "npm run build + npx tsx --test"
  rules:
    - no_any_without_justification
    - no_logic_in_controller
    - repository_exclusive_for_write
    - transaction_in_controller_or_use_case_confirmed_with_user
    - domain_errors_in_domain_folder
    - use_node_test_not_vitest_unless_decided
