# Week 24: Regular Expressions (RegEx) Tutorial

## Introduction

Regular Expressions (RegEx) are powerful patterns used to match, search, and manipulate text. They're essential for validation, parsing, and text processing in JavaScript.

## 1. RegEx Pattern Syntax

### Creating Regular Expressions

There are two ways to create a regular expression in JavaScript:

```javascript
// Literal notation (preferred for static patterns)
const regex1 = /pattern/flags;

// Constructor notation (useful for dynamic patterns)
const regex2 = new RegExp('pattern', 'flags');

// Examples
const emailPattern = /\w+@\w+\.\w+/;
const dynamicPattern = new RegExp(`user${userId}`, 'i');
```

### Basic Patterns

```javascript
// Literal characters - match exact text
const pattern1 = /hello/;
console.log(pattern1.test('hello world')); // true

// Special characters need escaping with backslash
const pattern2 = /\./; // matches a literal dot
const pattern3 = /\$/; // matches a dollar sign
```

## 2. Character Classes

Character classes match specific sets of characters.

### Predefined Character Classes

```javascript
// \d - matches any digit (0-9)
const digits = /\d+/;
console.log('Room 123'.match(digits)); // ['123']

// \D - matches any non-digit
const nonDigits = /\D+/;
console.log('Room 123'.match(nonDigits)); // ['Room ']

// \w - matches word characters (a-z, A-Z, 0-9, _)
const word = /\w+/;
console.log('hello_world123'.match(word)); // ['hello_world123']

// \W - matches non-word characters
const nonWord = /\W+/;
console.log('hello world!'.match(nonWord)); // [' ']

// \s - matches whitespace (space, tab, newline)
const whitespace = /\s+/;
console.log('hello   world'.match(whitespace)); // ['   ']

// \S - matches non-whitespace
const nonWhitespace = /\S+/;
console.log('  hello'.match(nonWhitespace)); // ['hello']

// . - matches any character except newline
const anyChar = /h.llo/;
console.log(anyChar.test('hello')); // true
console.log(anyChar.test('hallo')); // true
```

### Custom Character Classes

```javascript
// [abc] - matches any character in the set
const vowels = /[aeiou]/;
console.log('hello'.match(vowels)); // ['e']

// [^abc] - matches any character NOT in the set
const consonants = /[^aeiou]/g;
console.log('hello'.match(consonants)); // ['h', 'l', 'l']

// [a-z] - matches characters in a range
const lowercase = /[a-z]+/g;
const uppercase = /[A-Z]+/g;
const alphanumeric = /[a-zA-Z0-9]+/g;

console.log('Hello World 123'.match(lowercase)); // ['ello', 'orld']
console.log('Hello World 123'.match(uppercase)); // ['H', 'W']
```

## 3. Quantifiers

Quantifiers specify how many times a pattern should match.

```javascript
// * - matches 0 or more times
const zeroOrMore = /ab*c/;
console.log(zeroOrMore.test('ac'));    // true (0 b's)
console.log(zeroOrMore.test('abc'));   // true (1 b)
console.log(zeroOrMore.test('abbbbc')); // true (4 b's)

// + - matches 1 or more times
const oneOrMore = /ab+c/;
console.log(oneOrMore.test('ac'));    // false (needs at least 1 b)
console.log(oneOrMore.test('abc'));   // true
console.log(oneOrMore.test('abbbbc')); // true

// ? - matches 0 or 1 time (makes it optional)
const optional = /colou?r/;
console.log(optional.test('color'));  // true
console.log(optional.test('colour')); // true

// {n} - matches exactly n times
const exactly = /\d{3}/;
console.log(exactly.test('12'));   // false
console.log(exactly.test('123'));  // true
console.log(exactly.test('1234')); // true (matches first 3)

// {n,} - matches n or more times
const nOrMore = /\d{3,}/;
console.log(nOrMore.test('12'));    // false
console.log(nOrMore.test('123'));   // true
console.log(nOrMore.test('12345')); // true

// {n,m} - matches between n and m times
const range = /\d{3,5}/;
console.log('12'.match(range));      // null
console.log('123'.match(range));     // ['123']
console.log('123456'.match(range));  // ['12345']

// Greedy vs Lazy quantifiers
const greedy = /<.+>/;  // Greedy - matches as much as possible
const lazy = /<.+?>/;   // Lazy - matches as little as possible

const html = '<div>Hello</div>';
console.log(html.match(greedy));  // ['<div>Hello</div>']
console.log(html.match(lazy));    // ['<div>']
```

## 4. Anchors

Anchors match positions, not characters.

```javascript
// ^ - matches the beginning of a string
const startsWith = /^Hello/;
console.log(startsWith.test('Hello World')); // true
console.log(startsWith.test('Say Hello'));   // false

// $ - matches the end of a string
const endsWith = /world$/;
console.log(endsWith.test('Hello world')); // true
console.log(endsWith.test('world Hello')); // false

// Combining ^ and $ for exact match
const exactMatch = /^Hello$/;
console.log(exactMatch.test('Hello'));       // true
console.log(exactMatch.test('Hello World')); // false

// \b - word boundary
const wordBoundary = /\bcat\b/;
console.log(wordBoundary.test('cat'));      // true
console.log(wordBoundary.test('cats'));     // false
console.log(wordBoundary.test('bobcat'));   // false
console.log(wordBoundary.test('the cat')); // true

// \B - not a word boundary
const notWordBoundary = /\Bcat/;
console.log(notWordBoundary.test('cat'));    // false
console.log(notWordBoundary.test('bobcat')); // true
```

## 5. Groups and Capturing

Groups allow you to treat multiple characters as a single unit.

```javascript
// ( ) - capturing group
const pattern = /(\d{3})-(\d{2})-(\d{4})/;
const ssn = '123-45-6789';
const match = ssn.match(pattern);

console.log(match[0]); // '123-45-6789' (full match)
console.log(match[1]); // '123' (first group)
console.log(match[2]); // '45' (second group)
console.log(match[3]); // '6789' (third group)

// (?: ) - non-capturing group
const nonCapturing = /(?:Mr|Mrs|Ms)\. (\w+)/;
const name = 'Mrs. Smith';
const result = name.match(nonCapturing);
console.log(result[0]); // 'Mrs. Smith'
console.log(result[1]); // 'Smith' (only capturing group)

// Backreferences - refer to captured groups
const repeated = /(\w+)\s\1/; // \1 refers to first group
console.log(repeated.test('hello hello')); // true
console.log(repeated.test('hello world')); // false

// Named capturing groups
const namedGroup = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const date = '2024-01-21';
const dateMatch = date.match(namedGroup);
console.log(dateMatch.groups.year);  // '2024'
console.log(dateMatch.groups.month); // '01'
console.log(dateMatch.groups.day);   // '21'
```

## 6. Lookahead and Lookbehind

These are zero-width assertions that don't consume characters.

```javascript
// (?=...) - positive lookahead
const lookahead = /\d+(?= dollars)/;
console.log('50 dollars'.match(lookahead)); // ['50']
console.log('50 euros'.match(lookahead));   // null

// (?!...) - negative lookahead
const negativeLookahead = /\d+(?! dollars)/;
console.log('50 euros'.match(negativeLookahead));  // ['50']
console.log('50 dollars'.match(negativeLookahead)); // null

// (?<=...) - positive lookbehind
const lookbehind = /(?<=\$)\d+/;
console.log('$50'.match(lookbehind));  // ['50']
console.log('€50'.match(lookbehind));  // null

// (?<!...) - negative lookbehind
const negativeLookbehind = /(?<!\$)\d+/;
console.log('€50'.match(negativeLookbehind)); // ['50']
console.log('$50'.match(negativeLookbehind)); // null

// Practical example: Password validation
// Must contain at least one digit, one lowercase, one uppercase, 8+ chars
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
console.log(passwordPattern.test('Abc12345')); // true
console.log(passwordPattern.test('abcdefgh')); // false (no uppercase/digit)
```

## 7. Flags

Flags modify how the pattern matching works.

```javascript
// g - global (find all matches, not just first)
const globalFlag = /a/g;
console.log('banana'.match(/a/));  // ['a'] (first match only)
console.log('banana'.match(/a/g)); // ['a', 'a', 'a'] (all matches)

// i - case insensitive
const caseInsensitive = /hello/i;
console.log(caseInsensitive.test('Hello')); // true
console.log(caseInsensitive.test('HELLO')); // true

// m - multiline (^ and $ match line breaks)
const multiline = /^test/m;
const text = 'hello\ntest\nworld';
console.log(multiline.test(text)); // true (matches 'test' at line start)

// s - dotAll (. matches newline characters)
const dotAll = /hello.world/s;
console.log(dotAll.test('hello\nworld')); // true

// Combining flags
const combined = /hello/gi;
console.log('Hello HELLO hello'.match(combined)); // ['Hello', 'HELLO', 'hello']
```

## 8. Common Patterns

### Email Validation

```javascript
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email) {
  return emailPattern.test(email);
}

console.log(validateEmail('user@example.com'));     // true
console.log(validateEmail('invalid.email'));        // false
console.log(validateEmail('user.name@domain.co.uk')); // true
```

### Phone Number Validation

```javascript
// US phone number formats
const phonePattern = /^(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

function validatePhone(phone) {
  return phonePattern.test(phone);
}

console.log(validatePhone('123-456-7890'));   // true
console.log(validatePhone('(123) 456-7890')); // true
console.log(validatePhone('+1 123 456 7890')); // true
console.log(validatePhone('12345'));          // false
```

### URL Validation

```javascript
const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

function validateURL(url) {
  return urlPattern.test(url);
}

console.log(validateURL('https://www.example.com'));        // true
console.log(validateURL('http://example.com/path?query=1')); // true
console.log(validateURL('not a url'));                      // false
```

### Other Common Patterns

```javascript
// Credit card (basic format)
const creditCard = /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/;

// ZIP code (US)
const zipCode = /^\d{5}(-\d{4})?$/;

// Date (MM/DD/YYYY)
const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

// Time (HH:MM)
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Hexadecimal color
const hexColor = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

// Username (alphanumeric, underscore, 3-16 chars)
const username = /^[a-zA-Z0-9_]{3,16}$/;
```

## 9. test() and match() Methods

### test() Method

Returns true or false.

```javascript
const pattern = /hello/i;

// Basic usage
console.log(pattern.test('Hello World')); // true
console.log(pattern.test('Goodbye'));     // false

// Use for validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

console.log(isValidEmail('user@example.com')); // true
```

### match() Method

Returns array of matches or null.

```javascript
// Without global flag - returns first match with groups
const pattern1 = /(\w+)@(\w+)\.(\w+)/;
const email = 'user@example.com';
const match1 = email.match(pattern1);

console.log(match1[0]); // 'user@example.com' (full match)
console.log(match1[1]); // 'user' (first group)
console.log(match1[2]); // 'example' (second group)
console.log(match1[3]); // 'com' (third group)

// With global flag - returns all matches (no groups)
const pattern2 = /\d+/g;
const text = 'I have 2 cats and 3 dogs';
const matches = text.match(pattern2);
console.log(matches); // ['2', '3']

// matchAll() - get all matches with groups
const pattern3 = /(\w+)@(\w+)\.(\w+)/g;
const emails = 'Contact: user@test.com or admin@site.org';
const allMatches = [...emails.matchAll(pattern3)];

allMatches.forEach(match => {
  console.log(`Email: ${match[0]}, User: ${match[1]}, Domain: ${match[2]}.${match[3]}`);
});
// Email: user@test.com, User: user, Domain: test.com
// Email: admin@site.org, User: admin, Domain: site.org
```

## 10. replace() with Patterns

The replace() method can use RegEx for powerful text manipulation.

```javascript
// Basic replacement
const text1 = 'Hello World';
const result1 = text1.replace(/World/, 'JavaScript');
console.log(result1); // 'Hello JavaScript'

// Global replacement
const text2 = 'cat cat cat';
const result2 = text2.replace(/cat/g, 'dog');
console.log(result2); // 'dog dog dog'

// Case-insensitive replacement
const text3 = 'Hello hello HELLO';
const result3 = text3.replace(/hello/gi, 'hi');
console.log(result3); // 'hi hi hi'

// Using captured groups
const date = '2024-01-21';
const formatted = date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1');
console.log(formatted); // '01/21/2024'

// Using replacement function
const text4 = 'I have 2 apples and 3 oranges';
const doubled = text4.replace(/\d+/g, (match) => {
  return parseInt(match) * 2;
});
console.log(doubled); // 'I have 4 apples and 6 oranges'

// Advanced replacement with function
const text5 = 'john doe, jane smith';
const capitalized = text5.replace(/\b\w+/g, (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
});
console.log(capitalized); // 'John Doe, Jane Smith'

// Using named groups in replacement
const namePattern = /(?<first>\w+) (?<last>\w+)/;
const fullName = 'John Doe';
const reversed = fullName.replace(namePattern, '$<last>, $<first>');
console.log(reversed); // 'Doe, John'

// Sanitizing user input
function sanitizeHTML(html) {
  return html.replace(/[<>]/g, (match) => {
    return match === '<' ? '&lt;' : '&gt;';
  });
}

console.log(sanitizeHTML('<script>alert("XSS")</script>'));
// '&lt;script&gt;alert("XSS")&lt;/script&gt;'
```

## Practical Examples

### Form Validation

```javascript
class FormValidator {
  static patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    zipCode: /^\d{5}(-\d{4})?$/
  };

  static validate(type, value) {
    return this.patterns[type]?.test(value) || false;
  }

  static getErrorMessage(type, value) {
    if (this.validate(type, value)) return null;

    const messages = {
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      password: 'Password must be 8+ characters with uppercase, lowercase, number, and special character',
      username: 'Username must be 3-20 characters (letters, numbers, underscore)',
      zipCode: 'Please enter a valid ZIP code'
    };

    return messages[type] || 'Invalid input';
  }
}

// Usage
console.log(FormValidator.validate('email', 'user@example.com')); // true
console.log(FormValidator.getErrorMessage('password', 'weak')); 
// 'Password must be 8+ characters...'
```

### Text Processing

```javascript
// Extract all hashtags from text
function extractHashtags(text) {
  const hashtagPattern = /#[a-zA-Z0-9_]+/g;
  return text.match(hashtagPattern) || [];
}

const tweet = 'Learning #JavaScript and #RegEx is fun! #coding';
console.log(extractHashtags(tweet)); 
// ['#JavaScript', '#RegEx', '#coding']

// Format phone numbers
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

console.log(formatPhoneNumber('1234567890')); // '(123) 456-7890'

// Censor profanity
function censorText(text, badWords) {
  const pattern = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
  return text.replace(pattern, (match) => '*'.repeat(match.length));
}

const badWords = ['bad', 'worse', 'worst'];
console.log(censorText('This is bad and worse than the worst', badWords));
// 'This is *** and ***** than the *****'
```

## Tips and Best Practices

1. **Start Simple**: Build patterns incrementally and test as you go
2. **Use Tools**: Test patterns on regex101.com or regexr.com
3. **Escape Special Characters**: Use `\` to match literal special characters
4. **Be Specific**: Avoid overly broad patterns that match unwanted text
5. **Consider Performance**: Complex patterns can be slow on large texts
6. **Use Comments**: For complex patterns, use the `x` flag (in some environments) or document separately
7. **Test Edge Cases**: Empty strings, special characters, very long inputs
8. **Validate User Input**: Always sanitize data from untrusted sources

## Practice Exercises

1. Create a pattern to validate strong passwords (min 8 chars, uppercase, lowercase, number, special char)
2. Write a function to extract all URLs from a text
3. Create a pattern to match valid IPv4 addresses
4. Write a function to convert camelCase to snake_case
5. Create a pattern to validate credit card numbers (with optional spaces/dashes)
6. Write a function to highlight search terms in text (case-insensitive)
7. Create a pattern to match balanced parentheses (simple version)
8. Write a function to parse CSV data using regex

## Summary

Regular expressions are powerful tools for:

- Pattern matching and validation
- Text searching and extraction
- String manipulation and replacement
- Data parsing and formatting

Master the basics first, then gradually tackle more complex patterns. Practice is key to becoming proficient with RegEx!
