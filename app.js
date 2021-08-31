const express = require('express');
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

app.use(express.json())

const users = [{
  name: "John",
  password: "1234"
}]

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgGW+7QwS8t0B85EC4QlASMZin4NyhEY1+CpGmQN8+uXDFzOO+e30
/dWwoQT7ustuwiZ7F0U46su/CwBGEHwC45Fr2KPEj1MejhdVi+C3uJ/RVo8+TkOt
wCV95Jtj/SXwH/DjsDuI/0GJ2INgejsEjuPl4BdKIDKA74WPa3V8jA9vAgMBAAEC
gYAEF6XZMnnqQcXWM1Nx19AViqn304dWe507thM5fLFqxGoOfNW4qH39NlmDpcxh
mlbczV6mPh/Tih+bJzZKhqM4jPBx3U3K/SW8ZO8bvxAZWY3GMcvTAenmPHvRwj5D
yyO8XdmrNIeBcVWgWnHFOWTfFePQXINZtNOYYbFMNrtWwQJBAMOsQUVsGfzl5xvo
HHTThhQ2jW9SRyxASn3lydU+baATDgbdYPySMyJPERAD2KZecqcTjO2ivkuXyaBe
gvaymJkCQQCFHVnH0HOBJkphsz1AlEJeCRynjZVkqi8Q42h4mZ4mJD3/lonsHTqb
rpNTwJ0bjssaAGBgA6XqPfpaGr8+BsVHAkAwP6lYlO9TjN0P5IwfwoitM0ZszL0A
DFpR8PdzvZEKh6hNyQjBPsudCiIK8OfbHi7nQ8rcTeTefu8YvDVO33sBAkAKHXTZ
Din4wmQckHYzFhEE/ERFJykXASeabO1fXKz70P01EsdgPchaVCW104kcsvkT/LtW
EHDnH9aKSkYF/JW5AkAJ3iHIhHN8Ybp+pmNk8N+jodDXS7eR8BQqM4rafEa0m6fF
MpesHlHz2sxyoh/gxYsPnbb+YBV7/YAu7U/3z1hk
-----END RSA PRIVATE KEY-----`

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGW+7QwS8t0B85EC4QlASMZin4Ny
hEY1+CpGmQN8+uXDFzOO+e30/dWwoQT7ustuwiZ7F0U46su/CwBGEHwC45Fr2KPE
j1MejhdVi+C3uJ/RVo8+TkOtwCV95Jtj/SXwH/DjsDuI/0GJ2INgejsEjuPl4BdK
IDKA74WPa3V8jA9vAgMBAAE=
-----END PUBLIC KEY-----`

function jwtGuard(req, res, next) {

  const idToken = req.headers.authorization;
  jwt.verify(idToken, publicKey, (err, decoded) => {
    if(err) {res.send(401, "Unauthorized")} else {
      req.userJwtToken = decoded;
      next();
    }
  })
}

app.post('/auth', (req, res) => {

  const {
    name,
    password
  } = req.body;

  const valid = users.some((user) => user.name === name && user.password === password)

  const tokenId = jwt.sign({
    name,
    password
  }, privateKey, {
    algorithm: 'RS256'
  })

  if (valid) {
    res.send(tokenId)
  }

  if (!valid) {
    res.send(404, "Account doesn't exist")
  }
})

app.get('/users', jwtGuard, (req, res) => {
  console.log(req.userJwtToken)
  res.send(users)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})