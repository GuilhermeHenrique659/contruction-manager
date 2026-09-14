name: feature-implementation-flow
on_project_start:
  steps:
    - confirm_business_model_with_user
    - define_bounded_context
  code_steps:
    - skeleton_use_case: "application/<UseCase>.ts com Input/Output"
    - skeleton_controller: "controller/<Module>Controller.ts com rota e esqueleto do use case"
    - write_tests: "testes seguindo padrão given/when/then (unit/narrow/broad conforme camada)"
    - run_tests_first_time: "npm run test — roda com testes passando ou falhando"
    - implement_use_case_and_domain: "use case, domain, repository, schema, implementação completa"
    - run_tests_again: "npm run test — roda novamente após implementação"
    - verify_lint_and_build: "npm run lint && npm run typecheck && npm run build"
  rules:
    - no_any_without_justification
    - no_logic_in_controller
    - repository_exclusive_for_write
    - transaction_in_controller_or_use_case_confirmed_with_user
    - domain_errors_in_domain_folder
    - use_node_test_not_vitest_unless_decided
