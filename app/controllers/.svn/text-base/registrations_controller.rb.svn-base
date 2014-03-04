# encoding: utf-8
class RegistrationsController < Devise::RegistrationsController

  def create
    if !verify_recaptcha
      flash.delete :recaptcha_error
      build_resource
      resource.errors.add(:base, "There was an error with the recaptcha code below. Please re-enter the code.")
      clean_up_passwords(resource)
      render :new
    else
      flash.delete :recaptcha_error
      super
    end
  end


  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
      set_flash_message(:notice, flash_message) if is_flashing_format?
      sign_in(resource_name, resource)
      respond_with resource, location: after_resetting_password_path_for(resource)
    else
      redirect_to user_path(current_user), alert: 'Error'
    end
  end

  protected

    def after_update_path_for(resource)
      user_path(resource)
    end
end