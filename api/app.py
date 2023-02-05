import os
import openai
import json
import random
from flask import Flask, redirect, render_template, request, Response, url_for, jsonify

app = Flask(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

# We only have one route, which is boring, but it's a start.
@app.route("/", methods=["GET", "POST"])
def index():

    result = openai.Completion.create(
        model="text-davinci-003",
        prompt=generate_prompt(),
        temperature=0.6,
        max_tokens=256,
    )

    room = json.loads(result.choices[0].text)
    response = jsonify(room)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def generate_prompt():
    exit = request.form.get('exit')
    names = request.form.get('names')
    count = request.form.get('count')

    if names is None:
        names = "a person"

    if exit is None:
        exit = "exit"


    deaths = [
        "slowly and painfully",
        "something terrible and horrifying",
        "an unexpected monster or thing",
        "something dull and ordinary",
        "someone else in the room",
        "something sudden and disgusting",
        "something that is very painful",
        "a tragic misunderstanding involving another person"
    ]

    random.shuffle(deaths)
    killer = deaths[0]
    print(killer)

    gpt_prompt = "In JSON, give a description of a scary, haunted room. The people in the room have entered it via " + exit + ". There must be either some scary root vegetables or horid tree roots or ghostly plants. The names of the people who enter the room are " + names + ". Exactly one person should be a victim who is killed by " + killer + ". The description should describe in detail how the victim is killed. The description should tell the backstory of the victim. The description should also explain if anyone will miss the victim now they are dead. The room should have fewer than six exits. At the end of the description explain what the exits are and name a person who should choose an exit. The victim cannot choose an exit. Do not say what their choice is.  The resulting JSON object should be in this format: {\"description\":\"string\",\"victim\":\"string\",\"exits\":[\"string\",\"string\",\"string\",\"string\"]}"

    if count == "5":
        gpt_prompt = "In JSON, give a description of a beautiful room filled with amazing things. There should be some lovely root vegetables. There should be something very valuable which should be described in detail including how much it might get if sold. The names of the people who enter the room are " + names + ". The description should explain how " + names + " feel about the things in the room. At the end of the description say what the the two people did together for the next ten years of their lives after leaving the room. There should be exactly zero exits from the room. Do not describe the exits. The victim should be both " + names + ". Do not mention the victims in the description.  The resulting JSON object should be in this format: {\"description\":\"string\",\"victim\":\"string\",\"exits\":[\"string\",\"string\",\"string\",\"string\"]}"
    if count == "1":
        gpt_prompt = "In JSON, give a description of a haunted house that is full of killer root vegetables. Describe in detail the history of the house and explain why it is haunted by root vegetables. Explain how " + names + " know each other and say they are looking for hidden treasure. There should be two or more exits from the room. Describe each exit and recommed one that seems most safe. The victim is nobody. Do not describe the victim. Finish the description by giving exactly one name from " + names + " who is nominated by the other people to decide the first exit everyone will take. The resulting JSON object should be in this format: {\"description\":\"string\",\"victim\":\"string\",\"exits\":[\"string\",\"string\",\"string\",\"string\"]}"
   
    
    return gpt_prompt