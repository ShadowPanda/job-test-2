# encoding: utf-8
require "rexml/document"

class PeopleController < ApplicationController
	skip_before_filter :verify_authenticity_token, :except => [:list]
	layout 'standard'

 	def list
   	@people = Person.find(:all)
	end
	
	def sort
		order = (params[:order] || "asc").to_s.downcase		
		order = "asc" if !["asc", "desc"].include?(order)
		records = Person.order("name #{order.upcase}").find(:all)

		render :json => {:order => order, :output => render_to_string(:partial => "records.html", :locals => {:records => records})}
	end
	
	def remote
		rv = { :status => 200, :success => false, :output => "" }

		uri = url_for((Rails.env == :development) ? {:action => :input, :port => 3001} : {:action => :input})
		res = RestClient.post(uri, :mail => {"key" => "value"}.to_json)

		rv[:output] = res.body
		
		begin
			doc = REXML::Document.new(rv[:output])
			rv[:success] = true if doc.root.name == "ok"			
		rescue
		end
		
		render :json => rv, :status => rv[:status]		
	end
	
	def input
		rv = Builder::XmlMarkup.new

		body = params[:mail]
		
		begin
			body = JSON.parse(body)
		rescue
			body = nil
		end

		if !request.post? || !body.is_a?(Hash) || Time.now.to_i % 2 == 0 then
			rv.error
		else
			rv.ok
		end
		
		render :xml => rv.target!
	end
end