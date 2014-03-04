class StdOutLogger
  def write(s)
    f = File.open("log/stdout.log", "w+")
    f.puts s.inspect
    f.close
  end
end