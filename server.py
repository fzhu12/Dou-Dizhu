from flask import Flask, render_template, jsonify, request, redirect, url_for

app = Flask(__name__)

progress = 1
score = 0

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/increment_progress')
def increment_progress():
    global progress
    progress = min(progress + 1, 7)
    return redirect_to_current_progress()

@app.route('/decrement_progress')
def decrement_progress():
    global progress
    progress = max(progress - 1, 1)
    return redirect_to_current_progress()

@app.route('/current_progress')
def current_progress():
    return redirect_to_current_progress()


def redirect_to_current_progress():
    if progress <= 3:
        return redirect(url_for('rules', rule_id=progress))
    else:
        return redirect(url_for('combo', combo_id=progress - 3))
    

    
@app.route('/rules/<int:rule_id>')
def rules(rule_id):
    rule_titles = {
        1: "Winning Rules",
        2: "Basic Rules",
        3: "Bidding Rules"
    }
    title = rule_titles.get(rule_id, "Unknown Rule")
    return render_template('rules.html', title=title, rule_id=rule_id)

@app.route('/combo/<int:combo_id>')
def combo(combo_id):
    return render_template('combo.html', combo_id=combo_id)

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/end')
def end():
    return render_template('end.html', score = score)


if __name__ == '__main__':
    app.run(debug=True)