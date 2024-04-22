from flask import Flask, render_template, jsonify, request, redirect, url_for
import json

app = Flask(__name__)

progress = 1
state = "home"
score = 0


combo_path = "static/data/combo.json"
with open(combo_path, "r") as combo_data:
    combo_dic = json.load(combo_data)

# 1: single with pic opts, 2: single without pic, 3: rank, 4: multiple
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
    return render_template("welcome.html", progress=progress)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/increment_progress")
def increment_progress():
    global progress
    progress = min(progress + 1, 10)
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
    if progress == 4:
        return redirect(url_for("rank"))
    if progress == 10:
        return redirect(url_for("finish"))
    else:
        return redirect(url_for("combo", combo_id=progress - 4))


@app.route("/rules/<int:rule_id>")
def rules(rule_id):
    rule_titles = {1: "Basic Rules", 2: "Bidding Rules", 3: "Winning Rules"}
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


@app.route("/rank")
def rank():
    return render_template("rank.html", rank=combo_dic["rank"])


@app.route("/finish")
def finish():
    return render_template("finish.html", rank=combo_dic["rank"])


# @app.route("/quiz")
# def quiz():
#     return render_template("quiz.html")


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    mp_qz = [quiz_1, quiz_2, quiz_3, quiz_4]

    if request.method == "POST":
        response = request.json 
        total = len(mp_qz)
        correct_num = 0
        data_for_template = []

        for i, quiz in enumerate(mp_qz):
            user_answer = response["answers"][i]
            correct_answer = quiz["correct"]
            is_correct = (
                (user_answer == correct_answer)
                if quiz["type"] == 3
                else (sorted(user_answer) == sorted(correct_answer))
            )
            correct_num += is_correct
            data_for_template.append(
                {
                    "question": quiz,
                    "user_answer": user_answer,
                    "correct_answer": correct_answer,
                    "is_correct": is_correct,
                }
            )

        score = round((correct_num / total) * 100)
        if score >= 90:
            message = "Outstanding performance! Congratulations!"
        elif score >= 75:
            message = "Great job! You really know your stuff."
        elif score >= 50:
            message = "Good effort! With a little more practice, you can master it."
        elif score >= 25:
            message = "Fair attempt. Keep studying and try again!"
        else:
            message = "It seems like you struggled. Review the material and try again!"

        return render_template(
            "quiz_result.html", score=score, message=message, data=data_for_template
        )

    else:
        return render_template("quiz.html", data={"quiz": mp_qz})


@app.route("/end")
def end():
    return render_template("end.html", score=score)


if __name__ == "__main__":
    app.run(debug=True)
