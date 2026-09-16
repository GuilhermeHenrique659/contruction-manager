export interface MemberOutput {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly members: MemberOutput[];
}

export interface CreateProjectInput {
  name: string;
  description: string;
}

export function createEmptyProject(): Project {
  return {
    id: '',
    name: '',
    description: '',
    members: [],
  };
}