import connection_manager
import util


def get_user_by_name(username):
    return connection_manager.execute_select('SELECT id FROM users WHERE username = %(username)s;',
                                             {'username': username})


def get_email_ids_by_email(email):
    return connection_manager.execute_select('SELECT id FROM users WHERE email = %(email)s;',
                                             {'email': email})


def get_passord_by_username(username):
    return connection_manager.execute_select('SELECT password FROM users WHERE username = %(username)s;',
                                             {'username': username})


def get_user_id_by_username(username):
    return connection_manager.execute_select('SELECT id FROM users WHERE username = %(username)s;',
                                             {'username': username})


def add_new_user(user):
    return connection_manager.execute_dml_statement('''
        INSERT INTO users (username, password, email, activation_code) VALUES(%(username)s, %(password)s, %(email)s, %(activation_code)s);
    ''', {'username': user["username"], 'password': util.hash_password(user["password"]), 'email': user["email"], 'activation_code': user['activation_code']})


def activate(activation_data):
    return connection_manager.execute_dml_statement('''
        UPDATE users SET activated=true WHERE username=%(username)s AND activation_code=%(activation_code)s RETURNING activated
    ''', {'username': activation_data['username'], 'activation_code': activation_data['code']})


def get_activated(username):
    return connection_manager.execute_select('''
        SELECT activated FROM users WHERE username=%(username)s;
    ''', {'username': username})


def get_boards_data(user_id):
    data = dict()
    data["statuses"] = connection_manager.execute_select('''
        SELECT * FROM statuses ORDER BY statuses.id;
    ''')
    data["boards"] = connection_manager.execute_select('''
        SELECT boards.id, boards.title
          FROM boards
          WHERE deleted = FALSE AND user_id = %(user_id)s
          ORDER BY boards.id;
    ''', {'user_id': user_id})
    data["cards"] = connection_manager.execute_select('''
        SELECT cards.id, cards.board_id, cards.status_id, cards.title, cards."order"
          FROM cards
          WHERE deleted = FALSE AND user_id = %(user_id)s
          ORDER BY cards."order";
    ''', {'user_id': user_id})
    return data

  
def add_new_board(board_title, user_id):
    return connection_manager.execute_dml_statement('''
        INSERT INTO boards (title, user_id) VALUES (%(board_title)s, %(user_id)s) RETURNING id;
    ''', {'board_title': board_title, 'user_id': user_id})


def add_new_card(card_title, board_id, status_id, user_id):
    return connection_manager.execute_dml_statement('''
        INSERT INTO cards (title, board_id, status_id, user_id) VALUES (%(card_title)s, %(board_id)s, %(status_id)s, %(user_id)s) RETURNING id;
    ''', {'card_title': card_title, 'board_id': board_id, 'status_id': status_id, 'user_id': user_id})


def update_card(card_id, order, status_id):
    return connection_manager.execute_dml_statement('''
        UPDATE cards SET "order"=%(order)s, status_id=%(status_id)s WHERE id=%(card_id)s;
    ''', {'order': order, 'status_id': status_id, 'card_id': card_id})


def edit_card(edited_card):
    connection_manager.execute_dml_statement('''
        UPDATE cards SET title = %(title)s WHERE id = %(id)s;
    ''', {'title': edited_card["cardTitle"], 'id': edited_card["cardId"]})


def delete_board(board_id):
    connection_manager.execute_dml_statement('''
        UPDATE cards SET deleted = TRUE WHERE board_id = %(board_id)s;
    ''', {'board_id': board_id})
    connection_manager.execute_dml_statement('''
        UPDATE boards SET deleted = TRUE WHERE id = %(board_id)s;
    ''', {'board_id': board_id})


def delete_card(card_id):
    connection_manager.execute_dml_statement('''
        UPDATE cards SET deleted = TRUE WHERE id = %(card_id)s;
    ''', {'card_id': card_id})
