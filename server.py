from flask import Flask, render_template, jsonify, request, redirect, url_for
import json

app = Flask(__name__)

progress = 1
state = "home"
score = 0


combo_path = "static/data/combo.json"
with open(combo_path, "r") as combo_data:
    combo_dic = json.load(combo_data)

# 1:single with pic opts, 2: single without pic, 3: rank, 4: multiple
quiz_1 = {
    "type": 3,
    "title": "Rank the following cards according to game's card hierarchy",
    "options": ["9C", "2C", "Abomb"],
    "correct": ["2", "1", "0"],
}
quiz_2 = {
    "type": 1,
    "title": "Which of the following is boomb ",
    "options": ["9C", "2C", "Abomb"],
    "correct": ["2"],
}
quiz_3 = {
    "type": 2,
    "title": "What’s the best option I deal in this turn?",
    "options": ["A", "2", "Joker", "Q"],
    "q_img": "qt_1",
    "correct": ["0"],
}

quiz_4 = {
    "type": 4,
    "title": "Which of the following are boombs",
    "options": ["9C", "2C", "Abomb", "Abomb"],
    "correct": ["2", "3"],
}


@app.route("/")
def welcome():
    return render_template("welcome.html")


@app.route("/increment_progress")
def increment_progress():
    global progress
    progress = min(progress + 1, 8)
    return redirect_to_current_progress()


@app.route("/decrement_progress")
def decrement_progress():
    global progress
    progress = max(progress - 1, 1)
    return redirect_to_current_progress()


@app.route("/current_progress")
def current_progress():
    return redirect_to_current_progress()


def redirect_to_current_progress():
    if progress <= 3:
        return redirect(url_for("rules", rule_id=progress))
    else:
        return redirect(url_for("combo", combo_id=progress - 3))


@app.route("/rules/<int:rule_id>")
def rules(rule_id):
    rule_titles = {1: "Winning Rules", 2: "Basic Rules", 3: "Bidding Rules"}
    title = rule_titles.get(rule_id, "Unknown Rule")
    return render_template("rules.html", title=title, rule_id=rule_id)


@app.route("/combo/<int:combo_id>")
def combo(combo_id):
    max = 3 * combo_id
    if combo_id == 5:
        combo = [combo_dic[str(max - 2)], combo_dic[str(max - 1)]]
    else:
        combo = [combo_dic[str(max - 2)], combo_dic[str(max - 1)], combo_dic[str(max)]]
    return render_template("combo.html", combo_id=combo_id, combo=combo)


@app.route("/detail/<int:detail_id>")
def detail(detail_id):
    return render_template(
        "detail.html", detail_id=detail_id, combo=combo_dic[str(detail_id)]
    )


# @app.route("/quiz")
# def quiz():
#     return render_template("quiz.html")


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    mp_qz = [quiz_1, quiz_2, quiz_3, quiz_4]
    if request.method == "POST":
        response = request.json
        # cal score
        total = len(mp_qz)
        print(response)
        correct = sum(
            [
                1
                for i in range(len(mp_qz))
                if mp_qz[i]["correct"] == response["answers"][i]
            ]
        )
        print(
            "Received submission data:",
            response,
            correct,
        )
        result_data = {
            "score": round((correct / total) * 100),
            "message": "Congratulations! ",
        }
        return render_template("quiz_result.html", data=result_data)

    data = {"quiz": mp_qz}

    return render_template("quiz.html", data=data)


@app.route("/end")
def end():
    return render_template("end.html", score=score)


if __name__ == "__main__":
    app.run(debug=True)
