from flask import Flask, render_template, session, request, redirect, jsonify, url_for
import queries
import util
import random
import string

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
    activation_code = ''.join(random.choice(string.ascii_lowercase) for _ in range(20))
    new_user = request.form.to_dict()
    new_user['activation_code'] = activation_code
    if len(queries.get_user_by_name(new_user["username"])):
        messages.append({'message': 'This username is already in use! Please select another one!', 'type': 'error'})
    if len(queries.get_email_ids_by_email(new_user["email"])):
        messages.append({'message': 'This email address is already in use!', 'type': 'error'})
    if new_user["password"] != new_user["passwordAgain"]:
        messages.append({'message': 'The two password must match!', 'type': 'error'})
    if not (4 <= len(new_user["username"]) <= 20):
        messages.append({'message': 'The length of the username must be between 4 and 20!', 'type': 'error'})
    if not (6 <= len(new_user["password"]) <= 20):
        messages.append({'message': 'The length of the password must be between 6 and 20!', 'type': 'error'})
    if not ('@' in new_user["email"] and '.' in new_user["email"]):
        messages.append({'message': 'Please enter a valid email address!', 'type': 'error'})
    if len(messages) == 0:
        queries.add_new_user(new_user)
        messages.append({'message': 'You registered successfully! Please check your emails, and activate your account.', 'type': 'success', 'activationCode': activation_code, 'email': new_user["email"], 'username': new_user["username"]})
    return jsonify({'messages': messages})


@app.route("/activate")
def activate():
    activation_data = request.args
    activated = queries.activate(activation_data)
    return render_template('activation.html', activated=activated)


@app.route("/get-data", methods=['POST'])
def get_boards():
    user_id = session["user"]["id"]
    data = queries.get_boards_data(user_id)
    data['username'] = session["user"]["username"]
    return jsonify(data)


@app.route("/login", methods=['POST'])
def login():
    login_data = request.form.to_dict()
    print(queries.get_activated(login_data["username"]))
    if not len(queries.get_user_by_name(login_data["username"])):
        return jsonify({'message': 'Incorrect username or password', 'type': 'error'})
    if not queries.get_activated(login_data["username"])[0]['activated']:
        return jsonify({'message': 'Please activate your account', 'type': 'error'})
    else:
        hashed_password = queries.get_passord_by_username(login_data['username'])[0]['password']
        if util.verify_password(login_data['password'], hashed_password):
            session['user'] = {
                'username': login_data["username"],
                'id': queries.get_user_id_by_username(login_data['username'])[0]['id']
            }
            return jsonify({'login': 'login_success'})
        else:
            return jsonify({'message': 'Incorrect username or password', 'type': 'error'})

          
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('boards'))


@app.route('/add-board', methods=['POST'])
def add_board():
    new_board_title = request.form['title']
    return jsonify({'newId': queries.add_new_board(new_board_title, session['user']['id'])[0],
                    'message': '"' + new_board_title + '" created successfully!'})


@app.route('/add-card', methods=['POST'])
def add_card():
    new_card_title = request.form['title']
    new_card_board_id = request.form['board_id']
    new_card_status_id = request.form['status_id']
    return jsonify({'newId': queries.add_new_card(new_card_title, new_card_board_id, new_card_status_id, session['user']['id'])[0]})


@app.route('/update-card', methods=['POST'])
def update_card():
    card_id = request.form['card_id']
    order = request.form['order']
    status_id = request.form['status_id']
    queries.update_card(card_id, order, status_id)
    return jsonify({})


@app.route('/edit-card', methods=['POST'])
def edit_card():
    edited_card = request.form.to_dict()
    queries.edit_card(edited_card)
    return jsonify({})


@app.route('/delete-board', methods=['POST'])
def delete_board():
    board_id = request.form["boardId"]
    queries.delete_board(board_id)
    return jsonify({"message": 'Board deleted successfully!'})


@app.route('/delete-card', methods=['POST'])
def delete_card():
    card_id = request.form["cardId"]
    queries.delete_card(card_id)
    return jsonify({"message": 'Card deleted successfully!'})


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()