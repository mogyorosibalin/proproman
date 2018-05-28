from flask import Flask, render_template, session, request, jsonify
import queries
app = Flask(__name__)

app.secret_key = "some_random_secret_key_for_proman_sprint_2"


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    if 'user' not in session:
        return render_template('user.html')
    return render_template('boards.html')


@app.route("/register", methods=['POST'])
def register():
    messages = list()
    new_user = request.form.to_dict()
    if len(queries.get_user_by_name(new_user["username"])):
        messages.append({'message': 'This username is already in use! Please select another one!', 'type': 'error'})
    if new_user["password"] != new_user["passwordAgain"]:
        messages.append({'message': 'The two password must match!', 'type': 'error'})
    if not (4 <= len(new_user["username"]) <= 20):
        messages.append({'message': 'The length of the username must be between 4 and 20!', 'type': 'error'})
    if not (6 <= len(new_user["password"]) <= 20):
        messages.append({'message': 'The length of the password must be between 6 and 20!', 'type': 'error'})
    if len(messages) == 0:
        queries.add_new_user(new_user)
        messages.append({'message': 'You registered successfully! You can log in now!', 'type': 'success'})
    return jsonify({'messages': messages})


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()