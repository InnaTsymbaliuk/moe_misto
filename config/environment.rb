# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
MoeMisto::Application.initialize!

ENV['RECAPTCHA_PUBLIC_KEY']  = 'XXX'
ENV['RECAPTCHA_PRIVATE_KEY'] = 'XXX'
