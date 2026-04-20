fetch('http://localhost:5000/api/auth/student/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Bob', emailOrRoll: 'test1245', password: 'test' })
})
.then(res => res.json())
.then(data => console.log('Live Server Response:', data))
.catch(err => console.error('Network Error:', err));
