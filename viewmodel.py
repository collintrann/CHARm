from flask import Flask, request, jsonify
#from flask_cors import flask_cors

app = Flask(__name__)
#cors = CORS(app)

@app.route('/')
def reciever():
   data = request.get_json()
   data = jsonify(data)
   return data

if __name__ == "__main__": 
   app.run(debug=True)
