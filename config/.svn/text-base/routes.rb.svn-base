MoeMisto::Application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks",
                                        :confirmations => 'confirmations',
                                        :passwords => "passwords",
                                        :registrations => "registrations"}

  scope "(:locale)", :locale => /en|ru|uk/ do

    resources :locations, only: :create
    resources :messages, only: [:show, :create, :update, :destroy]
    resources :claims
    resources :photos, only: :destroy
    resources :users, only: [:show, :update] do
      member do
        post 'update_password'
      end
    end

    root 'home#index'
    get '/about_us', to: 'home#about_us', as: 'about_us'
    post '/sendcoords', to: 'home#index'
    post '/history', to: 'home#history'
    post '/sendphotoid', to: 'home#showphoto'
    post '/markers', to: 'home#markers'
    post '/photos_author', to: 'photos#photos_author'
    post '/top_authors', to: 'users#top_authors'
    post '/recepient', to: 'messages#recepient'

    namespace :admin do
      resources :users, only: :index
      resources :photos
      post '/destroy_block', to: 'users#destroy_block'
      post '/approved_destroy', to: 'photos#approved_destroy'
    end
  end


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
