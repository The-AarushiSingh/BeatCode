<img width="650" height="346" alt="image" src="https://github.com/user-attachments/assets/fdd5dd8a-484e-49f3-9f0f-4baba526f6ec" />


# === AUTH ===
# Register
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"firstName":"Name","emailId":"email@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"emailId":"email@example.com","password":"pass123"}' -c cookies.txt

# Check user
curl http://localhost:3000/api/auth/check -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt

# === PROBLEMS ===
# Get all problems
curl http://localhost:3000/api/problems

# Get problem by ID
curl http://localhost:3000/api/problems/PROBLEM_ID

# Create problem (Admin)
curl -X POST http://localhost:3000/api/problems -H "Content-Type: application/json" -b cookies.txt -d @problem.json

# Update problem (Admin)
curl -X PUT http://localhost:3000/api/problems/PROBLEM_ID -H "Content-Type: application/json" -b cookies.txt -d '{"title":"Updated Title"}'

# Delete problem (Admin)
curl -X DELETE http://localhost:3000/api/problems/PROBLEM_ID -b cookies.txt

# === SUBMISSIONS ===
# Submit solution
curl -X POST http://localhost:3000/api/problems/PROBLEM_ID/submit -H "Content-Type: application/json" -b cookies.txt -d '{"code":"YOUR_CODE","language":"javascript"}'

# Get solved problems
curl http://localhost:3000/api/problems/user/solved -b cookies.txt