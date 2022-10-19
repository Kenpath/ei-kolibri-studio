// Constant values for Roles sorted by value
const Roles = new Map(
  [[
    'coach',
    { value: 'coach', text: 'Coach' },
  ],
  [
    'learner',
    { value: 'learner', text: 'Learner' }
  ]]);

export default Roles;

export const RolesList = Array.from(Roles.values());

export const RolesNames = {
  COACH: 'coach',
  LEARNER: 'learner',
};
