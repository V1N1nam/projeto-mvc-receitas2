const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

const serverConfig = (app) => {
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public'))); 

    app.use(expressLayouts);
    app.set('layout', 'layout');
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    
    app.use(session({
        secret: process.env.SESSION_SECRET || 'segredo_padrao_dev',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } 
    }));

    app.use(flash());

    
    app.use((req, res, next) => {
        res.locals.isAuthenticated = !!req.session.userId;
        res.locals.userName = req.session.userName || null;
        res.locals.successMessage = req.flash('success');
        res.locals.errorMessage = req.flash('error');
        next();
    });
};

module.exports = serverConfig;