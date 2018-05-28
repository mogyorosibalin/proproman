from flask import Flask, render_template, session, request, redirect
app = Flask(__name__)

app.secret_key = "some_random_secret_key_for_proman_sprint_2"


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    if 'user' not in session:
        return render_template('user.html')
    return render_template('boards.html')


@app.route("/login", methods=['POST'])
def login():
    print(request.form)
    return 'OK'


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()