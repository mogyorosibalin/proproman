import connection_manager
import util


def get_user_by_name(username):
    return connection_manager.execute_select('SELECT id FROM users WHERE username = %(username)s;',
                                             {'username': username})


def get_passord_by_username(username):
    return connection_manager.execute_select('SELECT password FROM users WHERE username = %(username)s;',
                                             {'username': username})


def get_user_id_by_username(username):
    return connection_manager.execute_select('SELECT id FROM users WHERE username = %(username)s;',
                                             {'username': username})


def add_new_user(user):
    return connection_manager.execute_dml_statement('''
        INSERT INTO users (username, password) VALUES(%(username)s, %(password)s);
    ''', {'username': user["username"], 'password': util.hash_password(user["password"])})


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
