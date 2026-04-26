# Sessions API Debug

## Issue: Right Panel history not working

## Debug Steps:

### 1. Check Backend Status
```bash
# Check if backend is running on port 5000
curl http://localhost:5000/api/sessions
```

### 2. Check Frontend API Calls
Open browser dev tools and check:
- Network tab for failed requests to `/api/sessions`
- Console for any CORS errors
- Response status codes

### 3. Common Issues:

**CORS Error**: 
```
Access to fetch at 'http://localhost:5000/api/sessions' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Backend Not Running**:
```
net::ERR_CONNECTION_REFUSED
```

**Wrong API Base**:
```
API_BASE should be: "http://localhost:5000/api"
```

### 4. Quick Fix Test:

Add this to RightPanel.jsx temporarily to debug:
```jsx
useEffect(() => {
  console.log('RightPanel mounted, testing sessions...');
  getSessions().then(data => {
    console.log('Sessions data:', data);
  }).catch(err => {
    console.error('Sessions error:', err);
  });
}, []);
```

## Expected Result:
- Should see session data in console
- Should see "Recent chats" populated in right panel

## If Still Broken:

1. **Backend not running**: Start with `npm start` in backend folder
2. **CORS issue**: Check backend CORS configuration  
3. **API endpoint missing**: Verify routes exist in server.js

The API functions exist, so it's likely a connection or CORS issue!
