import atexit

from flask import Flask, render_template, redirect, url_for, request, jsonify

from skill_data_tests import load_skills_df

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index2.html")


# @app.route("/update_skills")
# def update_skills():
#     skills = skills_df.to_dict(orient='records')
#     return render_template("update_skills.html", skills=skills)

@app.route('/update_skills')
def update_skills():
    sort_by = request.args.get('sort_by')
    sort_order = request.args.get('sort_order', 'asc')
    sorted_df = skills_df.copy()[["skill", "lvl", "priority"]]
    # sorted_df = skills_df
    if sort_by:
        ascending = True if sort_order == 'asc' else False
        sorted_df.sort_values(by=sort_by, ascending=ascending, inplace=True)
    # skills_as_html = sorted_df.to_html(classes='skills-table', index=False, border=0, escape=False, header=False)
    # skills = sorted_df.to_dict(orient='records')
    return render_template('update_skills.html', skills=sorted_df, sort_by=sort_by, sort_order=sort_order)


@app.route('/update_skill', methods=['POST'])
def update_skill():
    data = request.get_json()
    skill = data['skill']
    column = data['column']
    new_value = data['new_value']
    skills_df.loc[skills_df['skill'] == skill, column] = new_value
    print(skills_df.head(50))
    return jsonify(success=True)


def save_skills_df():
    pass
    # skills_df.to_json('skills.json', orient='records', lines=True)
    # print("Skills DataFrame saved to skills.json")


atexit.register(save_skills_df)


if __name__ == "__main__":
    skills_df = load_skills_df()
    print(skills_df.head(5))
    app.run(host="0.0.0.0", port=5001)
