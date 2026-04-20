fetch('https://quize-i74t.onrender.com/api/auth/student/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Bob2', emailOrRoll: 'test7777', password: 'test' })
})
.then(res => res.json())
.then(data => console.log('Live Server Response:', data))
.catch(err => console.error('Network Error:', err));
