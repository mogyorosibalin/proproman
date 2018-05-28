from flask import Flask, render_template, session, request, jsonify
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
    print(request.form.to_dict())
    return jsonify({'success': True})


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()