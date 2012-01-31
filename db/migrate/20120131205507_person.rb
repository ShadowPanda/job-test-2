# encoding: utf-8

class Person < ActiveRecord::Migration
  def up
		create_table :people, :force => true do |t|
		  t.string :name
		  t.timestamps
		end
  end

  def down
		drop_table :people
  end
end