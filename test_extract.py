import requests
import base64

cv_text = b"John Doe is a Senior DevOps Engineer with 10 years of experience in AWS, Kubernetes, and Terraform. He works at TechCorp."
b64 = base64.b64encode(cv_text).decode("utf-8")

resp = requests.post("http://localhost:3000/api/extract-cv", json={
    "base64Data": "data:text/plain;base64," + b64,
    "mimeType": "text/plain",
    "fileName": "johndoe.txt"
})

print(resp.status_code)
print(resp.text)
