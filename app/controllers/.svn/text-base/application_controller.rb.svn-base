# encoding: utf-8
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :set_locale
  before_filter :configure_permitted_parameters, if: :devise_controller?

  # TODO REFACTOR THIS !!!
  # before_filter {
  #   $stdout = $stderr = StdOutLogger.new
  # }

  private

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def default_url_options(options={})
    logger.debug "default_url_options is passed options: #{options.inspect}\n"
    { locale: I18n.locale }
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << [:nick, :first_name, :last_name, :birth_date, :gender ]
  end

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end
  def after_sign_in_path_for(resource_or_scope)
    root_path
  end

  def auth_user
    redirect_to root_path, alert: I18n.t('controllers.application.auth_user') unless user_signed_in?
  end

  def admin_user
    if user_signed_in?
      redirect_to root_path, alert: I18n.t('controllers.application.admin_user') unless current_user.is_admin? || current_user.is_superadmin?
    else
      redirect_to root_path, alert: I18n.t('controllers.application.auth_user')
    end
  end

  def block_upload
    if current_user.upload_photo == false
      redirect_to root_path, alert: I18n.t('controllers.application.block_upload')
    end
  end

end
