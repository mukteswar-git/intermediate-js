const text = "Hello, World!";
 
console.log(text.includes("World"));
console.log(text.includes("world"));
console.log(text.includes("Hello"));
console.log(text.includes("Goodbye"));

// With positon parameter
const message = "JavaScript is awesome";
console.log(message.includes("Java", 0));
console.log(message.includes("Java", 5));

// Practical example
const email = "user@example.com";
if (email.includes("@")) {
  console.log("Valid email format");
}

// Search in array of strings
const fruits = ["apple", "banana", "orange"];
const searchTerm = "ban";
const matchingFruits = fruits.filter(fruit => fruit.includes(searchTerm));
console.log(matchingFruits);


// startsWith()

const url = "https://www.example.com";

console.log(url.startsWith("https")); 
console.log(url.startsWith("http"));
console.log(url.startsWith("ftp"));

// With position parameter
console.log(url.startsWith("www", 8));

// Practical examples
const filename = "report.pdf";
if (filename.startsWith("report")) {
  console.log("This is a report file");
}

// Filter files by extension
const files = [
  "document.pdf",
  "image.jpg",
  "data.csv",
  "photo.jpg"
];

const imageFiles = files.filter(file => 
  file.endsWith(".jpg") || file.endsWith(".png")
);
console.log(imageFiles);

// URL validation
function isSecureUrl(url) {
  return url.startsWith("https://");
}

console.log(isSecureUrl("https://example.com"));
console.log(isSecureUrl("http://example.com"));


// endsWith()
console.log("\nendsWith()")

const filename1 = "document.pdf";

console.log(filename1.endsWith(".pdf"));
console.log(filename1.endsWith(".doc"));
console.log(filename1.endsWith("ent.pdf"));

// With length parameter
const str = "Hello, World!";
console.log(str.endsWith("Hello", 5));

// Practical example
function getFileType(filename) {
  if (filename.endsWith(".jpg") || filename.endsWith(".png")) {
    return "image";
  } else if (filename.endsWith(".pdf")) {
    return "document";
  } else if (filename.endsWith(".mp3")) {
    return "audio";
  }
  return "unknown";
}

console.log(getFileType("photo.jpg"));
console.log(getFileType("report.pdf"));

// Check multiple endings
const videoExtensions = [".mp4", ".avi", ".mov"];
const file = "movie.mp4";
const isVideo = videoExtensions.some(ext => file.endsWith(ext));
console.log(isVideo);


// Combined String Methods Example

// Email validator
function validateEmail(email) {
  return email.includes("@") &&
         email.includes(".") &&
         !email.startsWith("@") &&
         !email.endsWith("@");
}

console.log(validateEmail("user@example.com"));
console.log(validateEmail("@example.com"));

// File filter
const allFiles = [
  "report.pdf",
  "backup_report.pdf",
  "image.jpg",
  "backup_image.jpg",
  "data.csv"
];

const backupPdfs = allFiles.filter(file => 
  file.startsWith("backup") && file.endsWith(".pdf")
);
console.log(backupPdfs);

// Search functionality
function searchProducts(products, query) {
  query = query.toLowerCase();
  return products.filter(product => 
    product.toLowerCase().includes(query)
  );
}

const products = ["Laptop", "Desktop", "Tablet", "Smartphone"];
console.log(searchProducts(products, "top"));