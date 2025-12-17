const user = {
  name: 'Asha',
  profile: {
    address: {
      city: 'Mumbai'
    }
  }
};

// Traditional way (verbose)
const city1 = user && user.profile && user.profile.address && user.profile.address.city;

// Optional chaining (clean)
const city2 = user?.profile?.address?.city;
const zip = user?.profile?.address?.zip;

console.log(city2);
console.log(zip);

// WITH FUNCTION

const obj = {
  method() {return 'called'}
}

console.log(obj.method?.());
console.log(obj.missing?.());
console.log(obj.method());
// console.log(obj.missing());

// WITH ARRAYS  

const users = [{ name: 'Alice' }, { name: 'Bob' }];
console.log(users?.[0]?.name);
console.log(users?.[5]?.name);

const config = null;
console.log(config?.settings?.[0]);