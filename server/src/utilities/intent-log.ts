export default async (
  provider: string,
  method: string,
  intent: string,
  user_ref_id: string,
) => {
  // TODO: Implement intent logging functionality
  console.log('intent log', provider, method, intent, user_ref_id);
};
