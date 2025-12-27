// Promise.allSettled() - Wait for All Result

// Basic Example
const promises = [
  Promise.resolve(1),
  Promise.reject("Error!"),
  Promise.resolve(3)
];

const results = await Promise.allSettled(promises);
console.log(results);

// Real-World Example: Batch Operation
async function updateMultipleRecords(records) {
  const updatePromises = records.map(record =>
    fetch(`/api/records/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify(record)
    })
  );

  const results = await Promise.allSettled(updatePromises);

  const succeeded = results.filter(r => r.status === "fulfilled").length;
  const failed = results.filter(r => r.status === "rejected").length;

  console.log(`Updated: ${succeeded}, Failed: ${failed}`);

  // Return failed records for retry
  return results
    .map((result, index) => ({ result, record: records[index] }))
    .filter(({ result }) => result.status === "rejected")
    .map(({ record, result }) => ({
      record,
      error: result.reason
    }));
}