/*
 *  Usage file for PanasonicViera module
 */

var PanasonicViera = require('./panasonicviera');

var tv = new PanasonicViera('192.168.1.101');

tv.send(PanasonicViera.MUTE_TOGGLE);