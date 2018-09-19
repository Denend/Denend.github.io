# -*- coding: utf-8 -*-
from flask import render_template, url_for, redirect, flash, session, request, jsonify, send_from_directory, send_file, Response
from app import app, db
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Answer, Question
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.urls import url_parse
import json
from operator import itemgetter
from collections import OrderedDict
@app.route('/')
@app.route('/home')
def home():
    num_of_users = str(len(User.query.all()))
    name = User.query.filter_by(id=1).first()
    return render_template('home.html', title=u'Дом, сука', num_of_users=num_of_users, name=name)


@app.route('/_opros_process', methods=['GET', 'POST'])
def opros_process():
    #THe return type must be a str, tuple response instance, or WSGI callable
    #answers = request.get_json()  json.loads(request.data)
    if request.method == 'POST':
        ans = request.get_json()
        print ans
        for key in ans:
           q = Question.query.get(int(key))
           answer = Answer(qstion=q, author=current_user, ans=ans[key]['result'])
           db.session.add(answer)
        db.session.commit()
        result = {}
        for i in range(1, 10):
            result[i] = Answer.query.filter_by(ans=True, question_id=i).count()
        print result
        return jsonify(result)


@app.route('/opros')
@login_required
def opros():
    a = Answer.query.filter_by(user_id=current_user.id).count()
    if a > 0:
        flash(u'уже проходил опрос', 'info')
        return redirect(url_for('home'))
    return render_template('opros.html', title=u'Бро, пройди опросик')


@app.route('/_statistics_process', methods=['GET', 'POST'])
def statistics_process():
    result = {}
    for i in range(1, 10):
        result[i] = Answer.query.filter_by(ans=True, question_id=i).count()
    print result
    return jsonify(result)


@app.route('/statistics')
@login_required
def statistic():
    a = Answer.query.filter_by(user_id=current_user.id).count()
    if a == 0:
        flash(u'пройди опрос и сможешь посмотреть статистику', 'info')
        return redirect(url_for('opros'))
    return render_template('statistic.html', title=u'дыбай шо там')


@app.route('/about_us')
def about_us():
    return render_template('about_us.html', title=u'курлык')


@app.route('/f_y_process', methods=['GET', 'POST'])
def f_y_process():
    result = request.get_json()

    #print result['count']

    u = User.query.filter_by(id=current_user.id).first()
    #print u.f_y_record
    #print current_user.f_y_record
    #if u.f_y_record == None:
        #u.f_y_record = 0
        #db.session.commit()
    #print u.f_y_record
    print current_user.f_y_record
    #u_record = u.f_y_record
    if int(result['count']) > u.f_y_record:
        u.f_y_record = int(result['count'])
        db.session.commit()
    print u.f_y_record
    top3 = User.query.filter(User.f_y_record>=0).order_by(User.f_y_record.desc())[:3]
    print top3
    top3dic = {}
    for i in top3:
        top3dic[i.username] = i.f_y_record
    print top3dic


    #sorted_top3 = sorted(top3dic.items(), key= itemgetter(0))
    #print sorted_top3
    #send_top3 = jsonify(sorted_top3)
    #top3orderdic = OrderedDict(sorted(top3dic.items()))
    #print top3orderdic
    return jsonify(top3dic)

# Flappy Yuras view
@app.route('/flappy_yuras')
@login_required
def flappy_yuras():
    top1 = User.query.filter(User.f_y_record>=0).order_by(User.f_y_record.desc())[:1]
    top2 = User.query.filter(User.f_y_record>=0).order_by(User.f_y_record.desc())[1:2]
    top3 = User.query.filter(User.f_y_record>=0).order_by(User.f_y_record.desc())[2:3]
    top1send = []
    top2send = []
    top3send = []
    for i in top1:
        top1send.append(i.username)
        top1send.append(i.f_y_record)
    for i in top2:
        top2send.append(i.username)
        top2send.append(i.f_y_record)
    for i in top3:
        top3send.append(i.username)
        top3send.append(i.f_y_record)
    print top1send
    return render_template('flappy_yuras.html', top1name=top1send[0], top1score=top1send[1],
                                                top2name=top2send[0], top2score=top2send[1],
                                                top3name=top3send[0], top3score=top3send[1])


#User Login
@app.route('/login', methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    if request.method == 'POST':
        # get forms  fields
        username = request.form['username']
        password = request.form['password']
        remember_me = request.form.get('remember_me')
        if remember_me is not None:
            remember_me = True
        else:
            remember_me = False

        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            flash(u'Курлык, неправильный логин или пароль', 'danger')
            return redirect(url_for('login'))
        # Passed
        session['logged_in'] = True
        session['username'] = username
        login_user(user, remember=remember_me)
        flash(u'you are now logged in', 'success')
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('home')
        return redirect(next_page)
    return render_template('login.html', title=u'залагинся')


# Logout
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You are now logged out', 'success')
    return redirect(url_for('home'))


# User Register
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user is not None:
            flash(u'Уже кто-то назвал себя так', 'danger')
            return redirect(url_for('register'))
        else:
            u = User(username=username)
            u.set_password(password)
            db.session.add(u)
            db.session.commit()
            #questions = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6',
                        #'question7', 'question8','question9','question10']
            #for q in questions:
                #qst = Question(body=q)
                #db.session.add(qst)
            #db.session.commit()
            flash('Congratulations, you are now a registred user!', 'success')
            return redirect(url_for('login'))
    return render_template('register.html', title=u'зарегай себя')
