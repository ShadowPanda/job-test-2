# encoding: utf-8

class PeopleController < ApplicationController
	layout 'standard'

 	def list
   	@people = People.find(:all)
	end
end