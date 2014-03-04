module ApplicationHelper

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def flash_message flash_type
    case flash_type
      when :success
        "success"
      when :error
        "error"
      when :alert
        "warning"
      when :notice
        "notice"
      else
        "notice"
    end
  end
end
