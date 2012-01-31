# encoding: utf-8

JobTest2::Application.routes.draw do
	match "people(/:action)", :controller => "people", :constraints => {:actions => /list|show|remote/}, :defaults => {:action => :list}	
	root :to => "people#list"
end
