import pandas as pd
import matplotlib.pyplot as plt
import json


status_dict = {
    0: "not started",
    1: "in progress",
    2: "completed"
}



def get_status_string(status_num):
    return status_dict.get(status_num, "unknown status")

def load_skills_df():
    data = None
    with open ("skills_and_tasks.json", "r") as file:
        data = json.load(file)
    df = pd.DataFrame.from_dict(data['skills'], orient="index")
    df.reset_index(inplace=True)
    df.rename(columns={"index": "skill"}, inplace=True)
    return df

def create_skills_bar(df):
    plt.figure(figsize=(10, 6))
    plt.bar(df['index'], df['lvl'], color='blue') # TODO rename "index" to "skill"
    plt.xlabel('Skill')
    plt.ylabel('Level')
    plt.title('Skill Levels')
    plt.xticks(rotation=45, ha='right')  # Rotate the skill names for better readability
    plt.tight_layout()  # Adjust layout to make room for rotated labels
    # Show the plot
    # plt.show()
    plt.savefig("static/skills_bar.png")


if __name__ == "__main__":
    pass
    # df = load_skills_df()
    # create_skills_bar(df)
