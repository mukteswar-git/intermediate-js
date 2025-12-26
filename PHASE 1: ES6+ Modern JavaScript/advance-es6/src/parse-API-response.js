const apiResponse = {
  user: {
    profile: {
      name: 'Alice',
      settings: {
        theme: '',
        notifications: {
          email: false
        }
      }
    }
  }
};

const name = apiResponse?.user?.profile?.name ?? 'Guest';
const theme = apiResponse?.user?.profile?.settings?.theme ?? 'light';
const emailNotifications = apiResponse?.user?.profile?.settings?.notifications?.email ?? 'true';
const pushNotifications = apiResponse?.user?.profile?.settings?.notifications?.push ?? 'true';
const language = apiResponse?.user?.profile?.profile?.settings?.language ?? 'en';

console.log({
  name,
  theme,
  emailNotifications,
  pushNotifications,
  language
})