import connection_manager
import util


def get_user_by_name(username):
    return connection_manager.execute_select('SELECT id FROM users WHERE username = %(username)s;',
                                             {'username': username})


def add_new_user(user):
    return connection_manager.execute_dml_statement('''
        INSERT INTO users VALUES(%(username)s, %(password)s);
    ''', {'username': user["username"], 'password': util.hash_password(user["password"])})

